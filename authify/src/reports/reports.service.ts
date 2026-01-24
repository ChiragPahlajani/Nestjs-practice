import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Report } from './report.entity';
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}
  create(body: CreateReportDto, user: User) {
    const report = this.reportRepository.create(body);
    report.user = user;
    return this.reportRepository.save(report);
  }
  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    report.approved = approved;
    return this.reportRepository.save(report);
  }
}
